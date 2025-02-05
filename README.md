# Language Phrases Feature

Feature that allows users to explore and learn common phrases in different languages. Users can filter phrases by language and category (such as greetings, basic expressions, and emergency phrases).

## Features

- Browse phrases in multiple languages
- Filter phrases by categories (Greetings, Basic, Emergency)
- View original phrase text and its English translation
- Responsive design that works on desktop and mobile devices
- Real-time filtering and updates

## Tech Stack

### Frontend
- Next.js 15.1.6
- TypeScript
- Tailwind CSS for styling
- Axios for API calls

### Backend
- Spring Boot
- PostgreSQL Database
- Java
- RESTful API

## Database Schema

The application uses three main tables:
- `languages`: Stores available languages
- `categories`: Stores phrase categories
- `phrases`: Stores the actual phrases with translations

### Database Relations

```sql
languages
- language_id (PK)
- language_name

categories
- category_id (PK)
- category_name

phrases
- phrase_id (PK)
- language_id (FK)
- category_id (FK)
- phrase_text
- translation
```
### API Enfpoints

- GET /api/phrases/languages - Retrieves all available languages
- GET /api/phrases/categories - Retrieves all phrase categories
- GET /api/phrases/search - Searches phrases with optional language and category filters
