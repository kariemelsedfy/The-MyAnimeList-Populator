# MyAnimeList Populator

A web app that helps anime fans discover, curate, and rate their MyAnimeList collections with a single swipe. Directly interacts with your MyAnimeList account after login via the MAL API. Built as a full-stack Node.js project, it features OAuth2 login, a PostgreSQL database, a swipeable Angular UI, and seamless deployment on Google Cloud & Firebase.

---

## 🚀 Features

- **Tinder-Style Swipe Deck**  
  Swipe **right** to add & rate an anime, swipe **left** to dismiss.
- **Instant Rating Prompt**  
  On swipe-right, users are prompted to enter a 1–10 score.
- **OAuth2 Authentication**  
  Secure “Sign in with MyAnimeList” flow; tokens stored in `localStorage`.
- **Real-Time Sync**  
  Adds/updates your MAL list via the MyAnimeList v2 API.
- **Optimistic UI**  
  Cards disappear immediately on swipe, even as server calls complete.
- **Responsive Design**  
  Mobile-first, works smoothly on phones, tablets, and desktops.
- **Cloud Deployment**  
  - Backend on **Google Cloud Run** (Cloud SQL for PostgreSQL)  
  - Frontend on **Firebase Hosting** with CI/CD via GitHub Actions

---

## 🛠 Tech Stack

- **Frontend:** Angular (TypeScript), Ionic UI, Hammer.js for gestures  
- **Backend:** Node.js, Express.js, OAuth2  
- **Database:** PostgreSQL (Cloud SQL)  
- **DevOps & Hosting:** Docker, Google Cloud Run, Firebase Hosting  
- **API:** MyAnimeList v2 REST API  

---

## 📥 Getting Started

### Prerequisites

- [Node.js & npm](https://nodejs.org/) (v14+)
- [Angular CLI](https://angular.io/cli)
- [Docker](https://www.docker.com/) (for local container tests)
- A MyAnimeList developer account & client ID/secret

### Clone the repo

```bash
git clone https://github.com/kariemelsedfy/theBetterAnimeList.git
cd theBetterAnimeList
