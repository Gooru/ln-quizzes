var countAnswers = () => +$('.accuracy .text-white-24').text()
var cleanText = text => text.replace(/[\.\s\t\-]/gi, '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
var picture = cleanText(/url\("https:\/\/officevibe\.blob\.core\.windows\.net\/img\/user-resized\/(.+)_w220_h220\.jpg"\)/.exec($('.flip-card-front .card-content').css('background-image'))[1])
var answer = $('.row.answer .choice-label').toArray().map((val, i) => ({
  index: i,
  name: cleanText($(val).text()),
  component: $(val)
})).filter(val => new RegExp(val.name, 'i').test(picture))[0]
