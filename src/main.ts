import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { existDir, createDir, store } from './utils/utils';
import { HypersignSSISdk } from 'hs-ssi-sdk';
import { json, urlencoded } from 'express';
import * as path from 'path';
import * as express from 'express';
// eslint-disable-next-line
const hidWallet = require('hid-hd-wallet');
import { Bip39, EnglishMnemonic } from '@cosmjs/crypto';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EdvClientKeysManager } from './edv/services/edv.singleton';
import { VaultWalletManager } from './edv/services/vaultWalletManager';
import { AppAuthModule } from './app-auth/app-auth.module';
import { AppOauthModule } from './app-oauth/app-oauth.module';
import { OrgUserModule } from './org-user/org-user.module';
//import { Header } from '@nestjs/common';
import * as cors from 'cors';

import * as session from 'express-session';
import * as passport from 'passport';
import { UserModule } from './user/user.module';

// eslint-disable-next-line
const HypersignAuth = require('hypersign-auth-node-sdk');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.use(express.static(path.join(__dirname, '../public')));
  // Adding prefix to our api

  const walletOptions = {
    hidNodeRestUrl: process.env.HID_NETWORK_API,
    hidNodeRPCUrl: process.env.HID_NETWORK_RPC,
  };
  const hidWalletInstance = new hidWallet(walletOptions);

  await hidWalletInstance.generateWallet({
    mnemonic: process.env.MNEMONIC,
  });

  // HID SDK instance
  const offlineSigner = hidWalletInstance.offlineSigner;
  const nodeRpcEndpoint = walletOptions.hidNodeRPCUrl;
  const nodeRestEndpoint = walletOptions.hidNodeRestUrl;
  const namespace = 'testnet';
  const hsSSIdkInstance = new HypersignSSISdk({
    offlineSigner,
    nodeRpcEndpoint,
    nodeRestEndpoint,
    namespace,
  });
  await hsSSIdkInstance.init();
  globalThis.hsSSIdkInstance = hsSSIdkInstance;

  const mnemonic_EnglishMnemonic: EnglishMnemonic = process.env
    .MNEMONIC as unknown as EnglishMnemonic;

  const kmsVaultWallet = await VaultWalletManager.getWallet(
    mnemonic_EnglishMnemonic,
  );

  // app.setGlobalPrefix('api/v1');
  if (!existDir(process.env.EDV_CONFIG_DIR)) {
    createDir(process.env.EDV_CONFIG_DIR);
  }
  const EDV_DID_FILE_PATH = `${process.env.EDV_CONFIG_DIR}/edv-did.json`;
  if (!existDir(EDV_DID_FILE_PATH)) {
    store(kmsVaultWallet.didDocument, EDV_DID_FILE_PATH);
  }

  const EDV_KEY_FILE_PATH = `${process.env.EDV_CONFIG_DIR}/edv-keys.json`;
  if (!existDir(EDV_KEY_FILE_PATH)) {
    store(kmsVaultWallet.keys, EDV_KEY_FILE_PATH);
  }

  const config = new ConfigService();
  try {
    // Super admin keymanager setup
    Logger.log('Before keymanager initialization', 'main');
    const kmsVaultManager = new EdvClientKeysManager();
    const vaultPrefixInEnv = config.get('VAULT_PREFIX');
    const vaultPrefix =
      vaultPrefixInEnv && vaultPrefixInEnv != 'undefined'
        ? vaultPrefixInEnv
        : 'hs:studio-api:';
    const edvId = vaultPrefix + 'kms:' + kmsVaultWallet.didDocument.id;
    const kmsVault = await kmsVaultManager.createVault(kmsVaultWallet, edvId);

    // TODO rename this to kmsVault for bnetter cla
    globalThis.kmsVault = kmsVault;

    Logger.log('After  keymanager initialization', 'main');
  } catch (e) {
    Logger.error(e);
  }

  try {
    // Swagger documentation setup

    const orgDocConfig = new DocumentBuilder()
      .setTitle('Entity Studio API')
      .setDescription('Open API Documentation of the Entity Studio')
      .setVersion('1.0')
      .build();

    // const tenantDocConfig = new DocumentBuilder()
    //   .setTitle('Entity Studio SSI API Playground')
    //   .setDescription('Open API Documentation of the Entity Studio')
    //   .addBearerAuth(
    //     {
    //       type: 'http',
    //       name: 'Authorization',
    //       in: 'header',
    //     },
    //     'Authorization',
    //   )
    //   .setVersion('1.0')
    //   .build();

    // const tenantDocuments = SwaggerModule.createDocument(app, tenantDocConfig, {
    //   include: [
    //     AppOauthModule,

    //   ], // don't include, say, BearsModule
    // });
    const orgDocuments = SwaggerModule.createDocument(app, orgDocConfig, {
      include: [AppAuthModule, AppOauthModule, UserModule], // don't include, say, BearsModule
    });
    const tenantOptions = {
      swaggerOptions: {
        defaultModelsExpandDepth: -1,
      },
      customfavIcon: '/Entity_favicon.png',
      customSiteTitle: 'API-Playground',
      customCss: ` .topbar-wrapper img {content:url(\'./Entity_full.png\'); width:135px; height:auto;margin-left: -150px;}
      .swagger-ui .topbar { background-color: #fff; }`,
    };
    const orgOptions = tenantOptions;
    SwaggerModule.setup('/', app, orgDocuments, orgOptions);
  } catch (e) {
    Logger.error(e);
  }

  // try {
  //   // Session for super admin
  //   if (
  //     !config.get('SUPER_ADMIN_USERNAME') ||
  //     !config.get('SUPER_ADMIN_PASSWORD')
  //   ) {
  //     throw new Error(
  //       'SUPER_ADMIN_USERNAME or SUPER_ADMIN_PASSWORD are not set in env',
  //     );
  //   }

  //   if (!config.get('SESSION_SECRET_KEY')) {
  //     throw new Error('SESSION_KEY is not set in env');
  //   }
  //   Logger.log('Setting up session start', 'main');
  //   app.use(
  //     session({
  //       secret: config.get('SESSION_SECRET_KEY'),
  //       resave: false,
  //       saveUninitialized: false,
  //       cookie: { maxAge: 3600000 },
  //     }),
  //   );
  //   app.use(passport.initialize());
  //   app.use(passport.session());
  //   Logger.log('Setting up session finished', 'main');
  // } catch (e) {
  //   Logger.error(e);
  // }

  // Only Allowing frontends which are mentioned in env
  const allowedOriginInEnv = JSON.parse(config.get('WHITELISTED_CORS')); // ["http://localhost:9001","https://wallet-jagrat.hypersign.id"]
  app.use(
    cors({
      origin: allowedOriginInEnv,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    }),
  );

  const server = await app.listen(process.env.PORT || 3001);

  // TODO: we might not need to pass hidWalletInstance.offlineSigner since this sdk only verifies presenatation
  const hypersignAuth = new HypersignAuth(
    server,
    hidWalletInstance.offlineSigner,
  );
  await hypersignAuth.init();
  globalThis.hypersignAuth = hypersignAuth;

  Logger.log(
    `Server running on http://localhost:${process.env.PORT}`,
    'Bootstrap',
  );
}
bootstrap();
