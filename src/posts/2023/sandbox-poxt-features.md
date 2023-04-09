---
layout: post
title: Sandbox Post
date: 2023-03-19
url: sandbox-post
permalink: "/posts/{{ url | slug }}/"
published: false
tags:
---
# Проверка фоторамы
## Обычная вставка тэгом
### Solo

<figure>
  <img src="/assets/img/posts/prmnav/DopExample.png" alt="Trulli">
  <figcaption>Подпись к картинке</figcaption>
</figure>

### Slider

<div class="fotorama" data-width="100%" data-height="800">
 <div><img src="/assets/img/posts/prmnav/DopExample.png" data-caption="Зеленый"></div>
 <div><img src="/assets/img/posts/prmnav/udoph.png" data-caption="Красный"></div>
</div>

### slider with shortdced
<div class="fotorama" data-width="100%" data-height="800"
     data-nav="dots">
     {% asset_img '/posts/prmnav/DopExample.png' 'Пример дополнительных подписей на табличка' 'Зеленый вариант' %}
     {% asset_img '/posts/prmnav/udoph.png' 'Пример дополнительных подписей на табличка' 'Красный вариант' %}
 
  
</div>

## Вставка шорткодом

### Solo

{% asset_img '/posts/prmnav/DopExample.png' 'Пример дополнительных подписей на табличка' 'Зеленый вариант' %}

### Slider

# Проверка встраивание различных сайтов

## Ютуб
https://youtu.be/-xKM3mGt2pE

## Твиттер

## Твиттер плагином

https://twitter.com/andrey_sitnik/status/1644667063699423233

### Твиттер скриптом

<blockquote class="twitter-tweet" data-dnt="true" data-theme="dark"><p lang="en" dir="ltr">We’re a proud sponsor of the <a href="https://twitter.com/SWEtalk?ref_src=twsrc%5Etfw">@SWEtalk</a>! Catch us at <a href="https://twitter.com/hashtag/WE22?src=hash&amp;ref_src=twsrc%5Etfw">#WE22</a> to discuss opportunities to <a href="https://twitter.com/hashtag/JoinTheFlock?src=hash&amp;ref_src=twsrc%5Etfw">#JoinTheFlock</a> <a href="https://twitter.com/hashtag/AWorldofOpportuntiesAwaits?src=hash&amp;ref_src=twsrc%5Etfw">#AWorldofOpportuntiesAwaits</a>. <a href="https://twitter.com/SWEtalk?ref_src=twsrc%5Etfw">@SWEtalk</a> <a href="https://twitter.com/TwitterCareers?ref_src=twsrc%5Etfw">@TwitterCareers</a> <a href="https://twitter.com/TwitterWomen?ref_src=twsrc%5Etfw">@TwitterWomen</a> <a href="https://t.co/qwMcG9adyj">pic.twitter.com/qwMcG9adyj</a></p>&mdash; Twitter Engineering (@TwitterEng) <a href="https://twitter.com/TwitterEng/status/1582764965252907008?ref_src=twsrc%5Etfw">October 19, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Instagram
https://www.instagram.com/p/CpumzTZNB-Q/?utm_source=ig_web_copy_link

## Telegram

## Tg SC

{% tg-embed 'FourierNotesRU' '62' %}

## Spotify Trak

https://open.spotify.com/track/0vg11qnqwfpg1inJlzbJE4?si=ee7d8e9e7c094204

## Spotify Playlist

https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM?si=517d6fa9fc4840ea

## Spotify Podcast 

https://open.spotify.com/show/5nNAqovqxJbnd5xZ2ZLlQ3?si=4c28b08175d84b30
