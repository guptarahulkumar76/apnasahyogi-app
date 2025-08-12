export const vendors = Array.from({ length: 100 }).map((_, index) => {
  const categories = [
    'Labour',
    'Plumber',
    'Electrician',
    'Carpenter',
    'Painter',
    'Caterer',
    'Welder',
  ];

  const sampleNames = {
    Labour: ['Suraj', 'Dinesh', 'Manoj', 'Kamal', 'Rajesh'],
    Plumber: ['Ramesh', 'Suresh', 'Mahesh', 'Naresh', 'Umesh'],
    Electrician: ['Amit', 'Vijay', 'Pankaj', 'Tarun', 'Karan'],
    Carpenter: ['Ravi', 'Kishan', 'Mohan', 'Gopal', 'Satish'],
    Painter: ['Deepak', 'Sunil', 'Hemant', 'Akash', 'Lokesh'],
    Caterer: ['Anil', 'Yash', 'Nitin', 'Rahul', 'Irfan'],
    Welder: ['Arjun', 'Bhavesh', 'Imran', 'Prakash', 'Sohan'],
  };

  const category = categories[index % categories.length];
  const names = sampleNames[category];
  const name = `${names[index % names.length]} ${category}`;

  // Matching images with setCategories list
  const categoryImages = {
    Labour: require('../../../../assets/images/labour.png'),
    Plumber: require('../../../../assets/images/plumber.png'),
    Electrician: require('../../../../assets/images/electrician.png'),
    Carpenter: require('../../../../assets/images/carpenter.png'),
    Painter: require('../../../../assets/images/painter.png'),
    Caterer: require('../../../../assets/images/caterer.png'),
    Welder: require('../../../../assets/images/welder.jpg'),
  };

  return {
    id: `${index + 1}`,
    name,
    image: categoryImages[category],
    rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
    experience: `${Math.floor(Math.random() * 10) + 1} yrs`,
    category,
    isOnline: Math.random() > 0.5,
    location: "Mumbai, India",
    priceRange: `₹${Math.floor(Math.random() * 500) + 200} / day`
  };
});
