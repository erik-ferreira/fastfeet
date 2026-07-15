import { Module } from "@nestjs/common"

import { DatabaseModule } from "@/infra/database/database.module"
import { CryptographyModule } from "@/infra/cryptography/cryptography.module"

@Module({
  imports: [DatabaseModule, CryptographyModule],
})
export class HttpModule {}
