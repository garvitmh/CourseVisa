const items = document.querySelectorAll('.course-playlist ul li');
const video = document.getElementById('mainVideo');
const title = document.getElementById('videoTitle');

items.forEach(item => {
  item.addEventListener('click', () => {
    items.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    video.src = item.getAttribute('data-video');
    title.textContent = item.getAttribute('data-title');
    video.play();
  });
});

// --- MORE COURSES FUNCTIONALITY ---
document.addEventListener('DOMContentLoaded', () => {
    const moreCoursesBtn = document.getElementById('more-courses-btn');
    const courseListContainer = document.querySelector('.similar-courses .course-list');

    // Mock database for new courses
    const newCourses = [
        {
            title: 'Advanced JavaScript', 
            price: '55.00',
            rating: 5,
            image: 'https://placehold.co/60x60/7b2cbf/FFFFFF?text=JS',
            link: '#'
        },
        {
            title: 'CSS Grid & Flexbox',
            price: '45.00',
            rating: 5,
            image: 'https://placehold.co/60x60/228be6/FFFFFF?text=CSS',
            link: '#'
        },
        {
            title: 'React for Beginners',
            price: '60.00',
            rating: 5,
            image: 'https://placehold.co/60x60/40c057/FFFFFF?text=React',
            link: '#'
        },
        {
            title: 'Node.js Fundamentals',
            price: '60.00',
            rating: 5,
            image: 'https://placehold.co/60x60/f76707/FFFFFF?text=Node',
            link: '#'
        }
    ];

    const loadMoreCourses = () => {
        newCourses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';

            const ratingStars = '⭐'.repeat(course.rating);

            courseCard.innerHTML = `
                <a target="_blank" href="${course.link}">
                    <img src="${course.image}" alt="${course.title}" height="50" width="50">
                </a>
                ${course.title} - $${course.price} ${ratingStars}
            `;
            courseListContainer.appendChild(courseCard);
        });

        // Hide the button after loading the courses to prevent duplicates
        moreCoursesBtn.style.display = 'none';
    };

    if (moreCoursesBtn) {
        moreCoursesBtn.addEventListener('click', loadMoreCourses);
    }
});
