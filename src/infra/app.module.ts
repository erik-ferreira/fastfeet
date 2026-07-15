import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { envSchema } from "@/infra/env/env"
import { EnvModule } from "./env/env.module"
import { HttpModule } from "./http/http.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
    }),
    EnvModule,
    HttpModule,
  ],
})
export class AppModule {}
