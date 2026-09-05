export class ResponsePatotaDto {
  id: string | undefined;
  title: string;
  patotaOwner: string;
  patotaDate: Date;
  amountPlayers: number;
  monthlyValue: number;

  createdAt: Date;
  updatedAt: Date | null;
}
