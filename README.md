# Salary Compass 🧭

A modern web application that helps professionals make informed decisions about job offers by analyzing and comparing total compensation packages, including base salary, bonuses, and overtime benefits.

## Features

- 💰 Compare multiple job offers side by side
- 📊 Calculate total compensation including base salary, bonuses, and overtime
- 🔐 Secure storage of your compensation data
- 📱 Responsive design for desktop and mobile
- 🌙 Dark mode support
- 🔄 Real-time updates and calculations

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel + Supabase Cloud

## Prerequisites

- Node.js 22 or later
- npm or pnpm or yarn
- Supabase CLI
- Git

## Local Development Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/salary-compass.git
cd salary-compass
```

2. Install dependencies
```bash
npm install
```

3. Set up Supabase locally
```bash
# Install Supabase CLI if you haven't
brew install supabase/tap/supabase  # for macOS
# or
npx supabase@latest init

# Start Supabase locally
npx supabase start
```

4. Create environment variables file (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key  # From supabase start output
```

5. Run database migrations
```bash
npx supabase migration up
```

6. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Database Schema

- [ ] Plan to use Prisma

## Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Supabase Deployment
1. Create a new project in Supabase
2. Update environment variables with production Supabase credentials
3. Run migrations on production database

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Contact

Your Name - [@TheJosephJu](https://twitter.com/TheJosephJu)

Project Link: [https://github.com/yourusername/salary-compass](https://github.com/0xj0s3ph/salary-compass)
