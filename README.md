# Abaco Investimenti

A modern financial education website built with Next.js, React, TypeScript, and Tailwind CSS.

## Project Overview

Abaco Investimenti is a financial education platform that provides courses, tools, and guides to help users reach their financial goals. The website includes:

- Educational content about investing
- Portfolio management tools
- AI-powered financial assistance
- Subscription plans

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **UI Libraries**:
  - React 19
  - Tailwind CSS
  - shadcn/ui components (based on Radix UI)
- **Styling**: Tailwind CSS with custom theming
- **State Management**: React Hooks
- **Form Handling**: React Hook Form with Zod validation

## Project Structure

- `/app` - Next.js app router pages and layouts
  - `/about` - About page
  - `/ai-chat-demo` - AI chat assistant demo
  - `/portfolio-demo` - Portfolio management demo
  - `/pricing` - Subscription pricing page
- `/components` - Reusable React components
  - `/ui` - UI components from shadcn/ui
- `/hooks` - Custom React hooks
- `/lib` - Utility functions
- `/public` - Static assets
- `/styles` - Global CSS

## Getting Started

### Prerequisites

- Node.js (18.x or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd abaco-investimenti

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Run the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run linting

## Component Structure

The project uses a component-based architecture:

- `layout.tsx` - Root layout with theme provider and navigation
- Main sections:
  - `HeroSection` - Homepage hero section
  - `FeatureSection` - Features overview
  - `TestimonialSection` - User testimonials
  - `SubscriptionCTA` - Call to action for subscriptions
  - `Navbar` - Main navigation
  - `Footer` - Site footer

## Styling

The project uses Tailwind CSS with a custom theme configured in `tailwind.config.ts`. The color scheme supports both light and dark modes through the `ThemeProvider`.

### CSS Convention

- Uses utility-first approach with Tailwind CSS
- Component-specific styles via Tailwind classes
- Custom utility function `cn()` for merging classes

## Adding New Features

1. For new pages:
   - Create a new directory in `/app`
   - Add a `page.tsx` file with the page content

2. For new components:
   - Add a new file in `/components`
   - Import and use existing UI components from `/components/ui`

3. For new API routes:
   - Create a new route in `/app/api`

## Deployment

The project is configured for deployment on Vercel or any other Next.js-compatible hosting platform.

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Developer Notes

- The project uses Next.js app router introduced in Next.js 13+
- UI components are based on shadcn/ui which leverages Radix UI primitives
- The codebase follows a component-based approach with clear separation of concerns
- The site is fully responsive and supports dark/light themes
- Form validation is handled using React Hook Form with Zod schemas 