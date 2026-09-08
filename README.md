## :rocket: Tecnologias

Foram usadas as seguintes tecnologias:

- [Node](https://nodejs.org/en)
- [NestJS](https://nestjs.com)
- [Docker](https://www.docker.com)
- [Prisma](https://www.prisma.io/docs)
- [DDD](https://www.devmedia.com.br/ddd-domain-driven-design-com-net/14416)

## :computer: Projeto

<!-- O fastfeet é uma plataforma para gerar títulos e descrições de vídeos baseado na transcrição do vídeo. Mas além disso o usuário pode escolher o que quer que seja gerado, como um trecho ou uma explicação sobre algo falado no vídeo. -->

O fastfeet é uma api para gerenciar um sistema de entrega de pedidos através do aplicativo e do painel administrativo. Nesse projeto foi aplicado vários conceitos de DDD e Clean Architecture.

## :thinking: Como rodar o projeto?

1. Instalar as dependências na pasta com `npm install`

2. Você deve criar as envs seguindo o arquivo `.env.example` deixado na raiz do projeto

3. Rodar o comando `docker compose up -d` para subir o container do docker na sua máquina

4. Rodar os comandos `npx prisma migrate dev` e `npx prisma migrate deploy` para rodar as migrations tanto em desenvolvimento quanto em produção

5. Rodar o comando `npm run start:dev` para rodar a aplicação
