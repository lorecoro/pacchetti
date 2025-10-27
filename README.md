This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## In production

After

```bash
git pull
npm i
npx prisma generate
```

couple things are needed:
- create the ssl folder inside /prisma and copy the pem and p12 files
- create the .env file and set the following values:

~~~
DATABASE_URL="mysql://user:password@1.2.3.4:3306/database?schema=public&connection_limit=5&sslcert=ssl/ca-cert.pem&sslidentity=ssl/client-identity.p12&sslpassword=password"

EMAIL_SERVER_USER=user@test.com
EMAIL_SERVER_PASSWORD=password
EMAIL_SERVER_HOST=mail.test.com
EMAIL_SERVER_PORT=465
EMAIL_FROM=user@test.com

NEXTAUTH_URL=https://my.site.com
~~~

### pm2 use

Add a section to ecosystem.config.yml:

~~~
  - name: "Pacchetti"
    script: "npm"
    args: "start"
    env:
      PORT: 3001
      NEXTAUTH_URL: "https://my.site.com"
    cwd: "/var/www/my.site.com"
    watch: false
    ignore_watch:
      - "node_modules"
    log_date_format: "YYYY-MM-DD HH:mm"
    error_file: "/var/log/pm2/Pacchetti_error.log"
    out_file: "/var/log/pm2/Pacchetti_out.log"
    combine_logs: true
    max_restarts: 10
    restart_delay: 2000
~~~

### build and start

```bash
npm run build
pm2 reload /path/to/ecosystem.config.yml
```