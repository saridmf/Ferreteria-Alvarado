// ============================================
// Integración formulario de contacto -> Backend Django
// Endpoint: POST /clientes/
// ============================================

const CLIENTES_API_URL = 'https://ferreteria-alvarado-backend-deploy.onrender.com/clientes/';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;

  // Caja de feedback (se crea una vez, se reutiliza)
  let feedbackBox = document.getElementById('contactFormFeedback');
  if (!feedbackBox) {
    feedbackBox = document.createElement('div');
    feedbackBox.id = 'contactFormFeedback';
    feedbackBox.style.marginTop = '12px';
    feedbackBox.style.fontSize = '14px';
    feedbackBox.style.display = 'none';
    form.appendChild(feedbackBox);
  }

  function showFeedback(message, isError) {
    feedbackBox.textContent = message;
    feedbackBox.style.display = 'block';
    feedbackBox.style.color = isError ? '#f87171' : '#16a34a';
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? 'Enviando…' : originalBtnText;
  }

  // Función auxiliar: deja solo dígitos en el teléfono y lo recorta a 12
  // (Telefono = CharField max_length=12 en el modelo Django)
  function sanitizePhone(rawValue) {
    return rawValue.replace(/\D/g, '').slice(0, 12);
  }

  // Función auxiliar: fecha de hoy en formato YYYY-MM-DD (DateField de Django)
  function todayISO() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedbackBox.style.display = 'none';

    const nombre = document.getElementById('name').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('email').value.trim();
    const interes = document.getElementById('message').value.trim();

    // Validación básica de longitud antes de enviar
    // (Nombres = CharField max_length=20 en el modelo Django)
    if (nombre.length > 20) {
      showFeedback(
        'El nombre es muy largo (máx. 20 caracteres). Por favor acórtalo.',
        true
      );
      return;
    }

    const payload = {
      Nombres: nombre,
      Telefono: sanitizePhone(telefono),
      Correo: correo,
      Fecha_Registro: todayISO(),
      Origen: 'Formulario web',
      Interes: interes.slice(0, 150), // Interes = CharField max_length=150
    };

    setLoading(true);

    try {
      const response = await fetch(CLIENTES_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Intenta leer el detalle de error que devuelve Django/DRF
        let detail = '';
        try {
          const errorData = await response.json();
          detail = Object.entries(errorData)
            .map(([campo, mensajes]) => `${campo}: ${mensajes}`)
            .join(' | ');
        } catch (_) {
          // respuesta sin JSON
        }
        throw new Error(detail || `Error ${response.status}`);
      }

      // Éxito
      showFeedback('¡Gracias! Tu mensaje fue enviado, te contactaremos pronto.', false);
      form.reset();

      // Tracking del envío exitoso (si gtag está disponible)
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'Formulario Contacto',
          event_label: 'contacto_footer',
        });
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      showFeedback(
        'No se pudo enviar tu mensaje. Verifica los datos o intenta de nuevo en unos minutos.',
        true
      );
    } finally {
      setLoading(false);
    }
  });
});