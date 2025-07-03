*[This repository was taken from the Cal Poly, Fall 2024 group for CSC 307.]*

freeloaders is an app designed to simplify finding free food distributed on campus for students & to attract footfall to events for on-campus organizations.

made with ❤️ by Wingsum Siu, Reenu Kutty, Suhanth Alluri, Dennis Kulik, Rishit Gupta

***

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Getting Started:

Clone the repo:
```
git clone https://github.com/CSC307Fall2024/FreeFoodFinder.git
```
Then naviagate to the freeloaders folder:
```
cd Freeloaders/freeloaders/
```
Then create a `.env` file in the `freeloaders` dir and add the following to it:
```
DATABASE_URL="postgresql://postgres.inuvxkvrinrnjobxwljn:CU9fKx3SU.JKLM2
@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
"
DIRECT_URL="postgresql://postgres.inuvxkvrinrnjobxwljn:CU9fKx3SU.JKLM2@aws-0-us-east-1.pooler.supabase.com:5432/postgres"


NEXTAUTH_SECRET="YegyDIZNJPqxOkGS4K0F/o9l3SjCxCUR4Q/45rGyOtA="
NEXTAUTH_URL="http://localhost:3000"
```
Then run:
```
npm install
```
Then to start a local instance use:
```
npm run dev
```

### Running Tests
```
npm test
```

### Logins you can use to test:

**org account:**
```
email: org1@calpoly.edu\
password: securepassword
```

**student account:**
```
email: jdoe@calpoly.edu\
password: securepassword
```

Notes:

- application takes a second to load after registering a new account, should redirect to landing page logged into new account
- make sure application is running on port 3000 for log out to work properly
