# Flyer PagoTop

Flyer 1080x1080 (renderizado em 2160x2160, 2x) inspirado no layout de referencia,
com identidade propria: paleta vermelho / preto / branco / cromado, faixa de ondas,
selo de data circular e marca "PAGO TOP" em adesivo cromado.

## Conteudo

- `template.html` — o design (HTML + CSS + SVG). Fonte editavel.
- `build.mjs` — inlina as fontes e renderiza os PNGs via Playwright/Chromium.
- `fonts/` — Anton, Archivo Black, Bebas Neue, Montserrat (Google Fonts, SIL OFL).
- `dist/pagotop-flyer.png` — arte final, sem artista.
- `dist/pagotop-flyer-guia.png` — mesma arte com a marcacao do espaco do artista.
- `dist/flyer.html` — versao autocontida (fontes embutidas), abre em qualquer navegador.

## Dados do evento

| Campo  | Valor                        |
|--------|------------------------------|
| Data   | Domingo, 16 de agosto        |
| Hora   | 20h00                        |
| Local  | Rosario de Saracuruna — RJ   |
| Marca  | PagoTop (unica no flyer)     |

## Gerar

```bash
node build.mjs                      # arte limpa + versao com guia
node build.mjs --art foto.png       # encaixa a foto do artista no espaco reservado
```

O `--art` aceita PNG (de preferencia com fundo recortado), JPG ou WebP. A imagem
e ajustada em `object-fit: contain` alinhada pela base, dentro da area
`.slot` (344, 96) 688x556 px.

## Editar

Tudo que muda com frequencia esta no final do `template.html`:

- selo de data: bloco `.date` (dia da semana, dia, mes, hora)
- tarja: `.tag` (`PAGODE • SAMBA • RESENHA`)
- local: `.venue`
- marca: o `<svg class="mark">` — para usar o logo oficial em vez do lockup
  desenhado aqui, troque o SVG por `<img class="mark" src="...">`
