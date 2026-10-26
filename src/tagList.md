---
layout: blog
pagination:
  data: collections
  size: 1
  # Skip Eleventy's built-in and helper collections, they aren't tags
  filter: [all, posts, podcasts, sortedPosts, tagList, markdownPages]
  alias: tag
permalink: /tags/{{ tag | slug }}/
eleventyComputed:
  title: "{{ tag }}"
  desc: "Заметки Димы Фурье с тегом «{{ tag }}» — все записи блога на эту тему."
---  

<h1 class="text-3xl font-bold mb-6">Записи с тегом «{{ tag }}»</h1>

{% for post in collections[tag] %}
<div class="py-4 sm:py-10">
  <p>
    <h2 class="text-2xl sm:text-4xl font-bold"><a href="{{ post.url }}">{{ post.data.title }}</a></h2>
  </p>
  <em><time datetime="{{ post.date | dateIso }}">{{ post.date | dateReadable }}</time></em>
  <div>{{ post.templateContent | lazyImages | replace: "<h1", "<h2" | replace: "</h1>", "</h2>" }}</div>
    <span><a href="{{ post.url }}">Read More</a></span>
  </p>
</div>
{% endfor %}
