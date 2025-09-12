# 🎮 Habbis - Gamified Habit Tracking App

A professional-grade, containerized habit tracking application with virtual pets that evolve based on user habits. Built with modern technologies and designed for scalability.

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend**: Expo Router + React Native (Universal iOS/Android/Web)
- **Backend**: Laravel 10+ with PHP 8.3
- **Database**: PostgreSQL 15 (optimized for gaming data)
- **Cache**: Redis 7
- **Infrastructure**: Full Docker containerization
- **CI/CD**: GitHub Actions with multi-environment deployment

### Key Features
- 🐾 **Virtual Pet System**: Pets evolve based on habit completion
- ⚔️ **Battle System**: Turn-based pet battles with other users
- 🏰 **Guild System**: Team challenges and competitions
- 🏆 **Achievement System**: Unlockable badges and rewards
- 🔥 **Streak System**: Bonus multipliers for consistent habits
- 💎 **Premium Currency**: Monetization through pet skins and features

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/habbis.git
cd habbis
```

### 2. Start Development Environment
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. Access Applications
- **API**: http://localhost:8000
- **Expo Web**: http://localhost:19006
- **Database**: localhost:5432 (user: habbis, password: habbis_password)
- **Redis**: localhost:6379

### 4. Initialize Database
```bash
# The database will be automatically seeded with sample data
# Check logs to confirm: docker-compose logs api
```

## 📱 Mobile Development

### Using Expo Go (Recommended for Development)
1. Install Expo Go on your device
2. Scan the QR code from the terminal output
3. The app will load on your device

### Using iOS Simulator
```bash
# Start iOS simulator
docker-compose exec expo npx expo start --ios
```

### Using Android Emulator
```bash
# Start Android emulator
docker-compose exec expo npx expo start --android
```

## 🛠️ Development Commands

### Backend (Laravel API)
```bash
# Access API container
docker-compose exec api bash

# Run migrations
php artisan migrate

# Run seeders
php artisan db:seed

# Run tests
php artisan test

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Frontend (React Native)
```bash
# Access Expo container
docker-compose exec expo bash

# Install dependencies
npm install

# Run linter
npm run lint

# Run type check
npm run type-check

# Run tests
npm test
```

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts with gamification stats
- `pets` - Virtual pets with battle stats and evolution
- `habits` - User-defined habits with rewards
- `habit_logs` - Daily habit completion tracking
- `battles` - Pet battle records and results
- `guilds` - Guild information and settings
- `guild_members` - Guild membership and roles
- `achievements` - Available achievements
- `user_achievements` - User achievement progress

### Key Relationships
- Users have many Pets, Habits, and HabitLogs
- Pets can participate in Battles
- Users can join Guilds
- Users can earn Achievements

## 🎮 Game Mechanics

### Pet Evolution System
- Pets gain XP from habit completion
- Evolution stages: 1 → 2 → 3 → 4 → 5
- Each evolution increases stats and changes appearance
- Evolution thresholds: Level 10, 25, 50, 75

### Battle System
- Turn-based combat between pets
- Stats: Attack, Defense, Speed, Health
- Battle types: PvP, PvE, Tournament, Guild
- Rewards: XP, Premium Currency, Items

### Achievement System
- Categories: Habits, Battles, Guild, Social, Special
- Rarities: Common, Uncommon, Rare, Epic, Legendary
- Hidden achievements unlock through discovery
- Repeatable achievements for ongoing engagement

## 🔧 API Documentation

### Authentication
```bash
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Habits
```bash
GET    /api/habits              # List user habits
POST   /api/habits              # Create habit
GET    /api/habits/{id}         # Get habit details
PUT    /api/habits/{id}         # Update habit
DELETE /api/habits/{id}         # Delete habit
POST   /api/habits/{id}/complete # Complete habit
POST   /api/habits/{id}/skip    # Skip habit
GET    /api/habits/stats/overview # Get habit statistics
```

### Pets
```bash
GET    /api/pets                # List user pets
POST   /api/pets                # Create pet
GET    /api/pets/{id}           # Get pet details
PUT    /api/pets/{id}           # Update pet
DELETE /api/pets/{id}           # Delete pet
POST   /api/pets/{id}/feed      # Feed pet
POST   /api/pets/{id}/evolve    # Evolve pet
```

### Battles
```bash
GET    /api/battles             # List battles
POST   /api/battles             # Create battle
GET    /api/battles/{id}        # Get battle details
POST   /api/battles/{id}/challenge # Challenge to battle
POST   /api/battles/{id}/accept # Accept battle
POST   /api/battles/{id}/decline # Decline battle
POST   /api/battles/{id}/make-move # Make battle move
```

## 🚀 Deployment

### Staging Environment
- Auto-deploys on `develop` branch merge
- Environment: `staging.habbis.com`
- Database: Staging PostgreSQL instance
- Cache: Staging Redis instance

### Production Environment
- Manual deployment trigger
- Environment: `habbis.com`
- Database: Production PostgreSQL cluster
- Cache: Production Redis cluster
- CDN: CloudFlare for static assets

### Docker Images
- API: `ghcr.io/your-username/habbis/api:latest`
- Mobile: `ghcr.io/your-username/habbis/mobile:latest`

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
docker-compose exec api php artisan test

# Run specific test suite
docker-compose exec api php artisan test --testsuite=Feature

# Run with coverage
docker-compose exec api php artisan test --coverage
```

### Frontend Tests
```bash
# Run all tests
docker-compose exec expo npm test

# Run tests in watch mode
docker-compose exec expo npm test -- --watch

# Run tests with coverage
docker-compose exec expo npm test -- --coverage
```

## 📊 Performance Monitoring

### Backend Monitoring
- Laravel Horizon for queue monitoring
- Redis monitoring for cache performance
- PostgreSQL query performance tracking
- API response time monitoring

### Frontend Monitoring
- React Native performance profiling
- Bundle size analysis
- Memory usage tracking
- Crash reporting

## 🔒 Security

### API Security
- Laravel Sanctum for authentication
- Rate limiting on all endpoints
- Input validation and sanitization
- SQL injection protection via Eloquent ORM
- CORS configuration for mobile apps

### Data Protection
- Password hashing with bcrypt
- JWT tokens for API authentication
- HTTPS enforcement in production
- Regular security updates

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `docker-compose exec api php artisan test && docker-compose exec expo npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards
- **PHP**: PSR-12, Laravel Pint
- **TypeScript**: ESLint + Prettier
- **React Native**: Functional components, hooks
- **Database**: Proper indexing, relationships
- **API**: RESTful design, proper error handling

## 📈 Roadmap

### Phase 1: Core Features ✅
- [x] User authentication and profiles
- [x] Habit tracking system
- [x] Pet evolution mechanics
- [x] Basic battle system
- [x] Achievement system

### Phase 2: Social Features 🚧
- [ ] Guild system improvements
- [ ] Social feed and activity
- [ ] Friend system
- [ ] Chat functionality
- [ ] Tournament system

### Phase 3: Advanced Features 📋
- [ ] Pet breeding system
- [ ] Advanced battle mechanics
- [ ] Seasonal events
- [ ] Premium subscriptions
- [ ] Analytics dashboard

### Phase 4: Platform Expansion 📋
- [ ] Web application
- [ ] Desktop app (Electron)
- [ ] Apple Watch integration
- [ ] Smart home integration
- [ ] API for third-party developers

## 📞 Support

### Documentation
- [API Documentation](docs/api.md)
- [Database Schema](docs/database.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guide](docs/contributing.md)

### Community
- [Discord Server](https://discord.gg/habbis)
- [GitHub Discussions](https://github.com/your-username/habbis/discussions)
- [Reddit Community](https://reddit.com/r/habbis)

### Contact
- **Email**: support@habbis.com
- **Twitter**: [@HabbisApp](https://twitter.com/habbisapp)
- **Website**: [habbis.com](https://habbis.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Laravel team for the amazing framework
- Expo team for React Native tooling
- PostgreSQL community for the robust database
- All contributors and beta testers

---

**Built with ❤️ for habit builders and pet lovers everywhere!**
