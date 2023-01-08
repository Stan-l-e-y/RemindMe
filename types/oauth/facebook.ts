import * as jose from 'jose';

export interface FacebookTokensResult {
  access_token: string;
  expires_in: Number;
  id_token: string;
  token_type: string;
}

export interface FaceBookDecodedIDToken extends jose.JWTPayload {
  nonce?: string;
  at_hash?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
}

export interface FaceBookUserResult {
  id: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  name: string;
  name_format?: string;
  picture?: string;
  short_name?: string;
}

enum Status {
  granted = 'granted',
  declined = 'declined',
  expired = 'expired',
}

export interface FacebookUserPermissionResult {
  permission: string;
  status: Status;
}

export interface FacebookUserPermissionsResult {
  data: FacebookUserPermissionResult[];
}
