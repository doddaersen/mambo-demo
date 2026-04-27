# MAMBO-szótár demo

A repó a MAMBO-szótár első, statikus webes demonstrációja. A cél nem a teljes szótár lezárása, hanem annak bemutatása, hogy a művészkönyvek formai-szerkezeti jellemzői több külön leírási rétegben kezelhetők: kötésmód, gerincszerkezet, könyvforma és tárolóelem.

## Tartalom

- `index.html` – a statikus demo kezdőoldala és kereshető szótárfelülete
- `assets/css/style.css` – a vizuális megjelenés
- `assets/js/app.js` – keresés, kategóriaszűrés és szócikk-megjelenítés
- `data/terms.json` – a pilot szócikkek strukturált adata

## GitHub Pages

A legegyszerűbb beállítás:

1. GitHub repó → **Settings**
2. **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main** / root
5. Mentés

Ezután az oldal várható címe:

`https://doddaersen.github.io/mambo-demo/`

## Módszertani fókusz

A demo azt mutatja meg, hogy a művészkönyvek leírása nem vezethető vissza egyetlen „kötéstípus” mezőre. A szótári rekordok külön kezelik a technikai kötésmódot, a gerinc szerkezetét, a könyvforma használati és olvasási logikáját, valamint a tárolóelemeket.
