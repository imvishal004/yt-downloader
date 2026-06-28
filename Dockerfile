FROM node:22

RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    nodejs \
    npm && \
    pip3 install --break-system-packages --upgrade pip && \
    pip3 install --break-system-packages --pre -U "yt-dlp[default]"

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]