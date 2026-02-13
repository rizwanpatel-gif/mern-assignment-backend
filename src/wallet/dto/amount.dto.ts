import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class AmountDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
