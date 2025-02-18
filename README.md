# Axon AI Call Center Demo

A demonstration environment for testing Axon AI's medical practice call center automation. This demo allows users to experience AI-powered patient interactions through a simulated medical practice environment.

## Features

- **Virtual Practice Environment**: Complete with auto-generated test patients and appointments
- **AI Phone Integration**: Call and interact with our AI receptionist
- **Real-time Dashboard**: Watch changes happen live as you interact with the system
- **Test Scenarios**: Pre-built scenarios for scheduling, canceling, and managing appointments

## Core Functionality

- Schedule new appointments
- Cancel or reschedule existing appointments
- Check medication information
- Review past appointment notes
- Real-time dashboard updates

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/BuckyMcYolo/ai-voice-agent-call-center-demo.git
cd call-center-demo
```

2. Install dependencies:

```bash
yarn
```

3. Configure environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/
│   ├── page.tsx                 # Landing page
│   ├── features/                # Features overview
│   ├── demo-guide/              # Interactive demo guide
│   └── sample-calls/            # Example call transcripts
├── db
|   ├── queries                  # Common DB queries
│   ├── schema                   # Drizzle Schema
├── components/                  # Reusable UI components
├── public/                      # Static assets
└── styles/                      # Global styles
```

## Technology Stack

- **Framework**: Next.js 14+
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **DB**: Neon Postgres
- **ORM**: Drizzle
- **Auth**: Better-Auth
- **AI**: Claude 3.5
- **STT/TTS**: Deepgram [see voice Websocker server here](https://github.com/Digital-Healthcare-Solutions/voice-ws)

## Development

```bash
yarn dev
```

### Building for Production

```bash
yarn build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Environment Variables

Required environment variables:
TODO

- `DB_CONNECTION_STRING`: for connecting to DB

## Support

For support, email support@getaxon.ai or open an issue in this repository.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
