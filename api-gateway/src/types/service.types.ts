export type ServiceDto<T> = {
  metadata: {
    tenant_id: string;
  };
  payload: T;
};
