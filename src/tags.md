---
layout: base
title: Теги
---

<h1 class="text-3xl font-bold mb-6">Теги</h1>

{% for tag in collections.tagList %}

<span>
    <a href="/tags/{{ tag | slug }}" class="link-novisited no-underline inline-block font-semibold py-2 px-4 bg-surface border border-border rounded-sm shadow-sm mr-6 mb-4">
        {{ tag }}
    </a>
</span>
{% endfor %}
