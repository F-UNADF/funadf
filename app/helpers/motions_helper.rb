module MotionsHelper

  def get_field field, kind, disabled = nil
    result = "toto"
    case kind
    when 'binary'
      result = "<div class='form-check #{(disabled)? 'disabled' : ''}'>"
      result += radio_button_tag field, "Oui", false, {class: 'form-check-input', disabled: disabled}
      result += label_tag field+"_Oui", "Oui", class: 'form-check-label'
      result += "</div>"
      result += "<div class='form-check #{(disabled)? 'disabled' : ''}'>"
      result += radio_button_tag field, "Non", false, {class: 'form-check-input', disabled: disabled}
      result += label_tag field+"_Non", "Non", class: 'form-check-label'
      result += "</div>"
    when 'neutral'
      result = "<div class='form-check #{(disabled)? 'disabled' : ''}'>"
      result += radio_button_tag field, "Oui", false, {class: 'form-check-input', disabled: disabled}
      result += label_tag field+"_Oui", "Oui", class: 'form-check-label'
      result += "</div>"
      result += "<div class='form-check #{(disabled)? 'disabled' : ''}'>"
      result += radio_button_tag field, "Non", false, {class: 'form-check-input', disabled: disabled}
      result += label_tag field+"_Non", "Non", class: 'form-check-label'
      result += "</div>"
      result += "<div class='form-check #{(disabled)? 'disabled' : ''}'>"
      result += radio_button_tag field, "Neutre", false, {class: 'form-check-input', disabled: disabled}
      result += label_tag field+"_Neutre", "Neutre", class: 'form-check-label'
      result += "</div>"
    when "free"
      result = "<div class='form-group'>"
      result += text_field_tag field, '', class: 'form-control', placeholder: "Votre réponse", disabled: disabled
      result += "</div>"
    end
    result.html_safe
  end

end