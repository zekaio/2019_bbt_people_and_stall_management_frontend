# 2019 BBT People and Stall Management Frontend

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Backend Setup

Backend github: https://github.com/caibinfeng/2019_bbt_people_and_stall_management/tree/dev

``` bash
# install composer

# update environment
copy .env.example .env
composer update
php artisan key:generate
php artisan jwt:aecret

# edit .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE= # new database
DB_USERNAME=
DB_PASSWORD=

DB_DATABASE_OLD=  # old database(bbt.sql)
DB_USERNAME_OLD=
DB_PASSWORD_OLD=

# migrate data
php artisan migrate --seed
php artisan data-migrate

# run server in localhost:8000
php artisan ser

# setup email settings

# random timetable
php artisan db:seed --class=ScheduleTableSeeder

# if error: "Class ScheduleTableSeeder does not exist" occurred
composer dump-autoload
php artisan db:seed --class=ScheduleTableSeeder

# create first week timetable: StallInfo.vue:237
stall.createFirstWeekRoute(2019, 1, '2019-8-26');
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
