# Did You Know?

A modern web application for sharing and discovering interesting facts across various categories including science, technology, history, health, and more.

## Features

- Browse facts by categories (Science, Technology, History, Health, Entertainment, etc.)
- Share your own facts with trustworthy sources
- Sort facts by newest or most popular
- Clean, responsive user interface
- Real-time data with Supabase backend

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Drave18/didyouknow.git
cd didyouknow
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be available in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Technologies Used

- Vanilla JavaScript
- HTML5 & CSS3
- Vite (Build tool)
- Supabase (Backend as a Service)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.