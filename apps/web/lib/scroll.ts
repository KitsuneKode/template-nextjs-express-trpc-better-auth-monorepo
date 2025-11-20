export const smoothScrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId.replace('#', ''));
  if (element) {
    const offset = 80; // Navbar height + padding
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};
