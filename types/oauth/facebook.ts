export interface FacebookTokensResult {
  access_token: string;
  expires_in: Number;
  id_token: string;
  token_type: string;
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

export interface FacebookPermissionResult {
  permission: string;
  status: Status;
}

export interface FacebookPermissionsResult {
  data: FacebookPermissionResult[];
}
