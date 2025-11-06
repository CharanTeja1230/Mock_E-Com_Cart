export async function GET() {
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 79.99,
      image: "/wireless-headphones.png",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 199.99,
      image: "/smartwatch-lifestyle.png",
    },
    {
      id: 3,
      name: "USB-C Cable",
      price: 19.99,
      image: "/usb-c-cable.jpg",
    },
    {
      id: 4,
      name: "Portable Speaker",
      price: 49.99,
      image: "/portable-speaker.png",
    },
    {
      id: 5,
      name: "Phone Case",
      price: 24.99,
      image: "/colorful-phone-case-display.png",
    },
    {
      id: 6,
      name: "Screen Protector",
      price: 14.99,
      image: "/screen-protector.png",
    },
  ]

  return Response.json({ products }, { status: 200 })
}
