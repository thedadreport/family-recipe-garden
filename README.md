# Family Recipe Garden

AI-powered recipe solutions that turn dinner stress into family joy. From "what's in my fridge?" to "plan my whole week" - we've got the recipe for every family situation.

## Features

### 🍳 Recipe Generator
- **Situational Recipe Generation**: 6 different cooking situations from "Protein + Random Stuff" to "One Pot Solutions"
- **Family-Focused**: Recipes designed for real families with kids who will actually eat them
- **AI-Powered**: Smart recipe generation based on your family size, preferences, and available time
- **Save & Organize**: Build your personal recipe collection

### 📅 Weekly Meal Planner
- **Complete Meal Plans**: 5-7 dinners planned in minutes
- **Budget-Conscious Options**: Plans that respect your grocery budget
- **Time-Saving Strategies**: Sunday prep schedules for busy weeknights
- **Shopping Lists**: Organized by store section with cost estimates
- **Prep Schedules**: Know exactly what to do when

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Claude API for recipe generation

## Getting Started

### Prerequisites
- Node.js 18 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/family-recipe-garden.git
cd family-recipe-garden
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
family-recipe-garden/
├── app/                      # Next.js app directory
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── recipe/              # Recipe generator route
│   │   └── page.tsx
│   └── weekly-plan/         # Weekly planner route
│       └── page.tsx
├── components/              # React components
│   ├── FamilyRecipeGenerator.tsx
│   ├── LandingPage.tsx
│   ├── Navigation.tsx
│   └── WeeklyMealPlanner.tsx
├── public/                  # Static assets
└── README.md
```

## Key Features

### Recipe Situations
1. **General Recipe** - Standard recipe generation
2. **Protein + Random Stuff** - Work with what you have
3. **Stretch Protein** - Feed more people with less
4. **Tonight + Tomorrow's Lunch** - Solve two meals at once
5. **One Pot Solution** - Minimal cleanup
6. **Dump and Bake** - Let the oven do the work

### Meal Planning Types
1. **General Planning** - Complete weekly meal plans
2. **Budget-Conscious** - Cost-optimized meal planning
3. **Time-Saving** - Prep-focused strategies

## Deployment

The app is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Deploy with zero configuration

For other platforms, build the project:

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## Business Strategy

### Target Users
- Busy parents (25-45 years old)
- Families struggling with weeknight dinner planning
- Home cooks looking for practical solutions

### Value Proposition
- **For Free Users**: Solve today's dinner crisis with situational recipes
- **For Pro Users**: Complete weekly planning system with shopping lists and prep schedules

### Revenue Model
- **Free Tier**: 5 recipes per month, basic family preferences
- **Pro Tier**: Unlimited recipes, weekly planning, shopping lists, prep schedules

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email hello@familyrecipegarden.com or create an issue in this repository.

---

Made with ❤️ for busy families who want to turn dinner stress into family joy.