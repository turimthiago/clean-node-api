export interface HashComparer {
  comparer(value: string, hash: string): Promise<Boolean>;
}
