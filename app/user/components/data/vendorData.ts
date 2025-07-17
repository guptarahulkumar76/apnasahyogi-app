export const vendors = Array.from({ length: 100 }).map((_, index) => {
  const categories = ['Plumber', 'Electrician', 'Carpenter', 'Labour', 'Caterer'];
  const sampleNames = {
    Plumber: ['Ramesh', 'Suresh', 'Mahesh', 'Naresh', 'Umesh'],
    Electrician: ['Amit', 'Vijay', 'Pankaj', 'Tarun', 'Karan'],
    Carpenter: ['Ravi', 'Kishan', 'Mohan', 'Gopal', 'Satish'],
    Labour: ['Suraj', 'Dinesh', 'Manoj', 'Kamal', 'Rajesh'],
    Caterer: ['Anil', 'Yash', 'Nitin', 'Rahul', 'Irfan'],
  };

  const category = categories[index % categories.length];
  const names = sampleNames[category];
  const name = `${names[index % names.length]} ${category}`;

  return {
    id: `${index + 1}`,
    name,
    image: require('@/assets/images/plumber.jpg'),
    rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
    experience: `${Math.floor(Math.random() * 10) + 1} yrs`,
    category,
    isOnline: Math.random() > 0.5,
  };
});
