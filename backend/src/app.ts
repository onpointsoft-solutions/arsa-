import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'
import config from './config/index'
import logger from './utils/logger'
import {
  errorHandler,
  notFoundHandler,
} from './middleware/errorHandler'
import { morganMiddleware, requestLogger } from './middleware/logging'

// Import routes
import authRoutes from './routes/auth.routes'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app: Application = express()

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')))

// CORS configuration
const ALLOWED_ORIGINS = [
  config.clientUrl,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8443',
]
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (e.g. curl, Postman) or whitelisted origins
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
      cb(new Error('Not allowed by CORS'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Logging middleware
app.use(morganMiddleware)
app.use(requestLogger)

// Rate limiting — relaxed in development
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.isDevelopment ? 0 : config.rateLimit.maxRequests, // 0 = unlimited in dev
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => config.isDevelopment, // bypass entirely in dev
})

app.use('/api/', limiter)

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  })
})

// Import remaining routes
import userRoutes from './routes/user.routes'
import propertyRoutes from './routes/property.routes'
import categoryRoutes from './routes/category.routes'
import locationRoutes from './routes/location.routes'
import agentRoutes from './routes/agent.routes'
import testimonialRoutes from './routes/testimonial.routes'
import messageRoutes from './routes/message.routes'
import appointmentRoutes from './routes/appointment.routes'
import settingsRoutes from './routes/settings.routes'
import uploadRoutes from './routes/upload.routes'

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/locations', locationRoutes)
app.use('/api/agents', agentRoutes)
app.use('/api/testimonials', testimonialRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/upload', uploadRoutes)

// 404 handler
app.use(notFoundHandler)

// Error handling middleware (must be last)
app.use(errorHandler)

export default app
