---
title: Как вести учёт налички в бизнесе и не свихнуться
desc: О некоторых подходах к учету наличности и отражению в Cash Flow
date: 2017-07-05
permalink: "/posts/{{ title | slug }}/"
# published: false
tags:
- Финансы
- Финансовый менеджмент
---
В управленческом учёте есть такой отчёт «Отчёт о движении денег» — он помогает сводить актуальные остатки, и видеть собственнику, куда ушли, и, откуда пришли деньги.
<!-- excerpt -->
{% asset_img 'cashflow-in-finance-managment.jpg' 'Питер Брейгель Младший. Выплата десятины (1615)' 'Питер Брейгель Младший. Выплата десятины (1615)'  %}

В связке с платёжным календарём и другими отчётами это помогает правильно составлять бюджеты. Но об этом чуть позже.

Уже месяц как я работаю в Нескучных финансах. Я помогаю предпринимателям внедрять управленческий учёт, и четко понимать, как работает их бизнес с точки зрения финансов.

В целом работа над проектом по внедрению управленческого учёта всегда разбивается на несколько этапов. Один из которых, как раз собрать отчёт о движении денег.

Если в ситуации с расчётным счётом все более-менее понятно: можно настроить нужные справочники в 1с и забирать цифры для отчета оттуда. В крайнем случае можно сесть и разнести банковские выписки и платежные поручения руками.

С наличкой ситуация сложнее. Если расчётных счетов немного, то наличка может жить на каком-то бесконечном количестве носителей — может быть пять карт, два сейфа, и ещё что-то под матрасом лежит.

Если в случае с расчетными счетами банк сам хранит данные, то в учёте налички всё зачастую завязано на человеческом факторе и дисциплине — не записал выдачу наличных или оплату наличным — вспоминай где деньги.

Пока я работал над проектами, встретил несколько ошибок, которые сильно тормозят работу. Так что давайте разберёмся — как с этим жить и вести учёт налички правильно.

## Корпоративные деньги на личных картах

Довольно частая история, когда деньги из бизнеса выводятся на личные карты. Это чревато тем, что, когда деньги лежат на личной карте, личные деньги слипаюстся с корпоративными.

Вечером, когда ты садишься разносить операции по статьям, в интернет-банке смешаны в кучу, твоя оплата обеда, покупка одежды детям и кофе в офис. Операций может быть десятки — и очень легко запутаться и забыть, когда ты брал что-то в офис и на компанию из корпоративных денег, а когда из личных. В результате можно легко ошибиться и записать в движение по компании, то что было личным и наоборот.

Вторая проблема здесь, скорее личного плана. Когда на карте лежат корпоративные деньги в кучу с личными — велик соблазн потратить не свои деньги.

> **Совет:**  
> Под корпоративную наличку заводить отдельную карту. Чтобы операции по ней проходили только те, которые касаются организации.

Так будет проще переносить данные по тратам в отчёт, легко сверять на опечатки и быстро находить ошибки в записи, если они возникли.

## Неправильное отражение перевода со счёта в наличку
Как правило, все операции в отчёте о движении денег сводятся к трём видам деятельности — операционная, инвестиционная и финансовая.

Когда, вы выводите деньги со счёта в наличку — это не операция. В этот момент денег в компании не становится ни больше не меньше — поэтому на такие случаи, есть строчка «Перевод со счёта (выбытие)» и Вход в наличку (поступление). Это технические операции необходимые для корректного расчета остатков на расчётнике и в наличке. Они не влияют на движение денег, но влияют на остатки на расчётных счетах.

Самая популярная ошибка здесь, когда с расчётного счёта вышло больше — а в кассу зашло меньше.

На самом деле операции «Перевод со счета» (выбытие) и «Вход в наличку» (поступления) должны быть равны. Но часто, по ошибке комиссии за вывод налички вписывают в эти операции.

В результате чего со счета ушло 10 000₽, а в наличку вошло 9 000₽

Для корректировки таких ситуаций есть статья «Комиссия за наличные» — она относится к операционнойдеятельности. так как влияет на движение денег.

Правильно записать так, если комиссию считаем выбытием с расчётного счёта:

<div class="warp">

|                                  | **С расчётника** | **С кассы** |  **Неправильно** |
| -------------------------------- | ---------------: | ----------: | ---------------: |
| **Перевод со счёта (выбытие)**   |           —9 000 |     —10 000 |          —10 000 |
| **Вход в наличку (поступление)** |           +9 000 |     +10 000 |           +9 000 |
| **Комиссия за наличные (р/с)**   |           —1 000 |      —1 000 | Где ещё касарь?! |

</div>

Кроме того, часто встречается ошибка, когда оплату наличными включают в статью «Вход в наличку» — вместо того, чтобы разнести её по конкретной статье «оплата от клиента» — в таком случае, в конце месяца в сводном ДДС видно, что денег в кассу зашло больше, чем вышло с расчётного счёта.

> **Совет:**  
> Будьте внимательнее! В результате, когда построите сводный ОДДС по компании и всем счетам — у вас правильно сойдутся остатки.

## Несколько ответственных и отсутствие договоренностей

Тоже один из проблемных моментов, когда за наличку отвечает сразу несколько человек.

Часто это заканчивается тем, что некоторые вообще не знают, что у них есть корпоративные деньги или в случае, когда нужно сводить отчётность, нет доступа к движению по конкретному кошельку, или ответственный забыл их зафиксировать.

> **Совет:**  
> Договоритесь с коллегами, что играете по одинаковым правилам. Что те, у кого есть доступ к кошельку, сейфу, или какой-то части наличных денег обязаны отчитываться за них в конце дня.

Иначе разбор полётов, и попытки разобраться «где деньги» будут съедать больше времени, чем корректное ведение учёта.

##  Отсутствие ежедневной фиксации

Ещё одна проблема, когда движения по кассе фиксируются от случая к случаю, а не каждый день. Потом когда, приходит время разнести операции их уже так много, что вникать в каждую уже просто лень, и тут возможны ошибки, когда не хочется думать и цифры переносятся только ради того, чтобы свести остаток.

В результате, остатки показываются верно, а само движение по статьям далеко от реальности — из-за подобных ошибок, в дальнейшем может произойти неправильное распределение бюджетов.

В таком случае придётся тратить время на то, чтобы сверять руками операции за последние пол-года. Только таким способом будет реально выяснить, по каким статьям были такие аномальные сдвиги. А это может занимать до недели работы, так как операций может быть больше тысячи.

> **Совет:**  
> Заведите привычку переносить данные по операциям в движении денег в конце дня и сверять остаток, который показывает ДДС с тем, который по факту лежит в сейфе или на карте.

Это поможет быстро выявлять ошибки и опечатки и сэкономит время в будущем. Так как найти опечатки — самое сложное, что может случится при проверке отчёта ДДС.

### Запомните:
+ — Храните корпоративные деньги отдельно от личных.
+ Внимательно относитесь, к отражению операций по выходу с расчётного счёта и поступлению в наличку — они должны совпадать.
+ Заведите привычку переносить операции в конце дня и не откладывать на потом.
+ Если за разные кошельки ответственны разные люди договоритесь с ними, как будете фиксировать движения по картам.

Если вы хотите только начать внедрять управленческий учёт, почитайте [статьи коллег](https://noboring-finance.ru/gazeta) о том, как начать учёт финансов или подпишитесь на [базовый курс по финансам](https://noboring-finance.ru/upravlenka-download/).