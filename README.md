# Mobile Banking Web Application

A mobile-focused banking web application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Mobile-first design
- Real-time balance updates
- Transaction history
- Visit streak tracking
- Achievement system
- User profile management

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Heroicons
- Headless UI

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
cd banking-app
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── page.tsx        # Home page
│   ├── transactions/   # Transactions page
│   └── profile/        # Profile page
├── components/         # React components
│   └── layout/        # Layout components
├── store/             # Zustand store
├── types/             # TypeScript types
└── data/              # Mock data
```

## Development

- The application uses Zustand for state management
- Mock data is used for demonstration purposes
- All components are built with mobile-first approach
- Tailwind CSS is used for styling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 