/**
 * Main JavaScript for Women's Empowerment Collective Website
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu()
  initSmoothScrolling()
  initNewsletterForm()
  initLazyLoading()
  enhanceCardInteractions()
  initBackToTop()
  loadDynamicContent()

  const parallaxBgs = document.querySelectorAll(".parallax-bg")
  let ticking = false

  // Throttled scroll handler for better performance
  function updateOnScroll() {
    const scrollY = window.scrollY

    // Parallax effect (only on desktop to avoid mobile performance issues)
    if (window.innerWidth > 768) {
      parallaxBgs.forEach((bg) => {
        const speed = bg.getAttribute("data-speed") || 0.5
        bg.style.transform = `translateY(${scrollY * speed}px)`
      })
    }

    // Header shrink effect
    const header = document.querySelector(".site-header")
    if (header) {
      if (scrollY > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    }

    ticking = false
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateOnScroll)
      ticking = true
    }
  })

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible")
        observer.unobserve(entry.target) // Only animate once
      }
    })
  }, observerOptions)

  document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
    observer.observe(el)
  })
})

// Back to Top Button
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top')
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible')
      } else {
        backToTopBtn.classList.remove('visible')
      }
    })

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    })
  }
}

// Mobile Menu Toggle
function initMobileMenu() {
  const toggle = document.querySelector(".mobile-toggle")
  const nav = document.querySelector(".main-nav")

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("active")
      const isExpanded = nav.classList.contains("active")
      toggle.setAttribute("aria-expanded", isExpanded)
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isExpanded ? 'hidden' : ''
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove("active")
        toggle.setAttribute("aria-expanded", "false")
        document.body.style.overflow = ''
      }
    })

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("active")) {
        nav.classList.remove("active")
        toggle.setAttribute("aria-expanded", "false")
        document.body.style.overflow = ''
        toggle.focus()
      }
    })
  }
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href')
      if (href && href !== '#') {
        const target = document.querySelector(href)
        if (target) {
          e.preventDefault()
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
    })
  })
}

// Newsletter Form Handler
function initNewsletterForm() {
  const form = document.querySelector('.newsletter-form')
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const email = form.querySelector('.newsletter-input').value
      const button = form.querySelector('.btn')
      const originalText = button.textContent
      
      // Show loading state
      button.textContent = 'Subscribing...'
      button.disabled = true
      
      try {
        // Simulate API call (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Show success message
        button.textContent = 'Subscribed!'
        button.style.background = 'var(--accent)'
        form.querySelector('.newsletter-input').value = ''
        
        // Reset after 3 seconds
        setTimeout(() => {
          button.textContent = originalText
          button.disabled = false
          button.style.background = ''
        }, 3000)
        
      } catch (error) {
        // Show error message
        button.textContent = 'Try Again'
        button.disabled = false
        console.error('Newsletter subscription failed:', error)
      }
    })
  }
}

// Lazy Loading Images
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove('lazy')
          observer.unobserve(img)
        }
      })
    })

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img)
    })
  }
}

// Card Hover Effects Enhancement
function enhanceCardInteractions() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)'
    })
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)'
    })
  })
}

// Dynamic Content Loader
async function loadDynamicContent() {
  // Check for elements requiring data
  const newsContainer = document.getElementById("news-container")
  const programsContainer = document.getElementById("programs-container")
  const eventsContainer = document.getElementById("events-container")
  const resourcesContainer = document.getElementById("resources-container")

  if (newsContainer) {
    await loadNews(newsContainer)
  }

  if (programsContainer) {
    await loadPrograms(programsContainer)
  }

  if (eventsContainer) {
    await loadEvents(eventsContainer)
  }

  if (resourcesContainer) {
    await loadResources(resourcesContainer)
  }
}

// Load News Items
async function loadNews(container) {
  try {
    // In a real environment, this fetches from assets/data/news.json
    // For this demo, we'll simulate the fetch if the file isn't actually served via HTTP
    const response = await fetch("assets/data/news.json")
    let data

    if (response.ok) {
      data = await response.json()
    } else {
      throw new Error("Failed to load news")
    }

    // Limit to 3 items for homepage if specified
    const limit = container.dataset.limit ? Number.parseInt(container.dataset.limit) : data.length
    const itemsToDisplay = data.slice(0, limit)

    container.innerHTML = itemsToDisplay
      .map(
        (item) => `
      <article class="card">
        <div class="card-image">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
        </div>
        <div class="card-content">
          <span class="card-tag">${item.category}</span>
          <span class="card-date">${formatDate(item.date)}</span>
          <h3 class="card-title"><a href="${item.link}">${item.title}</a></h3>
          <p class="card-excerpt">${item.excerpt}</p>
          <div class="card-footer">
            <a href="${item.link}" class="card-link">Read More</a>
          </div>
        </div>
      </article>
    `,
      )
      .join("")
  } catch (error) {
    console.error("Error loading news:", error)
    // Keep the existing sample cards if data loading fails
  }
}

// Load Programs
async function loadPrograms(container) {
  try {
    const response = await fetch("assets/data/programs.json")
    let data

    if (response.ok) {
      data = await response.json()
    } else {
      throw new Error("Failed to load programs")
    }

    container.innerHTML = data
      .map(
        (program) => `
      <div class="card">
        <div class="card-image">
          <img src="${program.image}" alt="${program.title}" loading="lazy">
        </div>
        <div class="card-content">
          <h3 class="card-title">${program.title}</h3>
          <p class="card-excerpt">${program.description}</p>
          <div class="card-footer">
            <a href="#" class="btn btn-secondary">Learn More</a>
          </div>
        </div>
      </div>
    `,
      )
      .join("")
  } catch (error) {
    console.error("Error loading programs:", error)
  }
}

// Load Events
async function loadEvents(container) {
  try {
    const response = await fetch("assets/data/events.json")
    let data

    if (response.ok) {
      data = await response.json()
    } else {
      throw new Error("Failed to load events")
    }

    container.innerHTML = data
      .map(
        (event) => `
      <div class="card">
        <div class="card-image">
          <img src="${event.image}" alt="${event.title}" loading="lazy">
        </div>
        <div class="card-content">
          <div class="card-date">${formatDate(event.date)} • ${event.time}</div>
          <h3 class="card-title">${event.title}</h3>
          <p class="card-excerpt">${event.description}</p>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0.5rem 0;">📍 ${event.location}</p>
          <div class="card-footer">
            <a href="${event.registration?.link || "#"}" class="btn btn-primary">Register Now</a>
          </div>
        </div>
      </div>
    `,
      )
      .join("")
  } catch (error) {
    console.error("Error loading events:", error)
  }
}

// Load Resources
async function loadResources(container) {
  try {
    const response = await fetch("assets/data/resources.json")
    let data

    if (response.ok) {
      data = await response.json()
    } else {
      throw new Error("Failed to load resources")
    }

    container.innerHTML = data
      .map(
        (resource) => `
      <div class="card">
        <div class="card-content">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
            <span class="card-tag">${resource.category}</span>
            <span style="font-size: 0.8rem; background: var(--background-alt); padding: 0.2rem 0.5rem; border-radius: var(--radius-sm);">${resource.type}</span>
          </div>
          <h3 class="card-title">${resource.title}</h3>
          <p class="card-excerpt">${resource.description}</p>
          <div class="card-footer">
            <a href="${resource.downloadUrl}" class="btn btn-secondary">Download</a>
          </div>
        </div>
      </div>
    `,
      )
      .join("")
  } catch (error) {
    console.error("Error loading resources:", error)
  }
}

// Helper: Format Date
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString("en-US", options)
}