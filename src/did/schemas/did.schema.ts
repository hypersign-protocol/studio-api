import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsOptional, IsString } from 'class-validator';
import { Slip10RawIndex } from '@cosmjs/crypto';
import { Exclude } from 'class-transformer';

export type DidDocument = Did & Document;
export type DidDocumentMetaData = DidMetaData & Document;

@Schema()
export class Did {
  @ApiHideProperty()
  @IsOptional()
  @Prop()
  @Exclude()
  slipPathKeys?: Array<Slip10RawIndex>;
  @ApiHideProperty()
  @IsOptional()
  @Prop()
  @Exclude()
  hdPathIndex?: number;

  @ApiHideProperty()
  @Exclude()
  @Prop()

  @IsString()
  appId: string;
  @ApiProperty({
    description: 'Did of user',
    example: 'did:hid:testnet:1234',
  })
  @Prop()
  @IsString()
  did: string;
}

@Schema()
export class DidMetaData {
  @IsOptional()
  @Prop()
  slipPathKeys?: Array<Slip10RawIndex>;

  @IsOptional()
  @Prop()
  hdPathIndex?: number;

  @ApiProperty({
    description: 'Id of to which particular did is issued',
    example: 'aa4ded21-437e-4215-8792-601ce9ba3de5',
  })
  @Prop()
  appId: string;
  @ApiProperty({
    description: 'Did of user',
    example: 'did:hid:testnet:1234',
  })
  @Prop()
  did: string;
}



const DidSchema = SchemaFactory.createForClass(Did);
const DidMetaDataSchema = SchemaFactory.createForClass(DidMetaData);
DidSchema.index({ appId: 1, hdPathIndex: 1, did: 1 }, { unique: true });
DidMetaDataSchema.index({ appId: 1 }, { unique: true });
DidMetaDataSchema.index({ appId: 1, hdPathIndex: 1, did: 1 }, { unique: true });

export { DidMetaDataSchema, DidSchema };
