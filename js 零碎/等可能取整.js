function lottery(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

console.log(lottery(1, 3));
