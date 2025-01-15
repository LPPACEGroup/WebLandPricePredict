# Step 1: ใช้ Node.js เป็น Base Image สำหรับการ Build แอป
FROM node:18 as build-stage

# ตั้งค่า Working Directory
WORKDIR /app

# คัดลอกไฟล์ทั้งหมดไปยัง Container
COPY . .

# ติดตั้ง Angular CLI ทั่วไป
RUN npm install -g @angular/cli

# ติดตั้ง Dependencies และ Build แอป
RUN npm install
RUN ng build --configuration production

# Step 2: ใช้ Nginx สำหรับเสิร์ฟแอปที่ Build เสร็จแล้ว
FROM nginx:alpine

# คัดลอกไฟล์ที่ Build แล้วไปยัง Nginx
COPY --from=build-stage /app/dist/my-angular-app /usr/share/nginx/html

# เปิดพอร์ต 80 สำหรับเสิร์ฟ
EXPOSE 80

# คำสั่งสำหรับรัน Nginx
CMD ["nginx", "-g", "daemon off;"]
