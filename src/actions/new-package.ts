'use server';

export async function newPackage(formData: FormData) {
  const payment = formData.get("payment");

  console.log(payment);
  //TODO: revalidate home and package list
}