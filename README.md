````markdown
# Keyword Booster AI

## English

### Overview

This is a Next.js application with TypeScript, Tailwind CSS, and multi-language support (English/Japanese).

### Technologies

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Docker](https://www.docker.com/)
- i18n (Internationalization)

### Getting Started

#### Prerequisites

- Node.js (version 16 or later)
- pnpm

#### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/username/project-name.git
   cd project-name
   ```
````

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```

#### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Build

```bash
pnpm build
```

#### Docker

Build and run with Docker:

```bash
docker build -t project-name .
docker run -p 3000:3000 project-name
```

#### Project Structure

- src: Main application code
- public: Static assets
- messages: i18n translation files (English, Japanese)

---

## 日本語

### 概要

Next.jsを使用した、TypeScript、Tailwind CSS、多言語対応（英語/日本語）のアプリケーションです。

### 技術スタック

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Docker](https://www.docker.com/)
- i18n（国際化）

### 始め方

#### 前提条件

- Node.js（バージョン16以降）
- pnpm

#### インストール

1. リポジトリをクローンする

   ```bash
   git clone https://github.com/username/project-name.git
   cd project-name
   ```

2. 依存関係をインストールする

   ```bash
   pnpm install
   ```

3. 環境変数を設定する
   ```bash
   cp .env.example .env
   ```

#### 開発

開発サーバーを実行する：

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

#### ビルド

```bash
pnpm build
```

#### Docker

Dockerでビルドして実行：

```bash
docker build -t project-name .
docker run -p 3000:3000 project-name
```

#### プロジェクト構造

- src: メインアプリケーションコード
- public: 静的アセット
- messages: i18n翻訳ファイル（英語、日本語）

```

```
