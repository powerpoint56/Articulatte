const animalia = ["alligator","anteater","armadillo","auroch","axolotl","badger","bat","beaver","buffalo","camel","chameleon","cheetah","chipmunk","chinchilla","chupacabra","cormorant","coyote","crow","dingo","dinosaur","dolphin","duck","elephant","ferret","fox","frog","giraffe","gopher","grizzly","hedgehog","hippo","hyena","jackal","ibex","ifrit","iguana","koala","kraken","lemur","leopard","liger","llama","manatee","mink","monkey","narwhal","nyan cat","orangutan","otter","panda","penguin","platypus","python","pumpkin","quagga","rabbit","raccoon","rhino","sheep","shrew","skunk","slow loris","squirrel","turtle","walrus","wolf","wolverine","wombat"];

module.exports = {
  all: animalia,
  random: () => {
    return animalia.splice(Math.random() * animalia.length, 1)[0];
  }
}
