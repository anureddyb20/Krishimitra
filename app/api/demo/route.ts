import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    mode: 'demonstration',
    phase: 1,
    districts: [
      'Alappuzha',
      'Ernakulam',
      'Idukki',
      'Kannur',
      'Kasaragod',
      'Kollam',
      'Kottayam',
      'Kozhikode',
      'Malappuram',
      'Palakkad',
      'Pathanamthitta',
      'Thiruvananthapuram',
      'Thrissur',
      'Wayanad',
    ],
    sampleCrops: [
      { name: 'Nendran Banana', category: 'Fruits', localName: 'നേന്ത്രവാഴ' },
      { name: 'Black Pepper', category: 'Spices', localName: 'കുരുമുളക്' },
      { name: 'Small Cardamom', category: 'Spices', localName: 'ഏലം' },
      { name: 'Natural Rubber', category: 'Plantation', localName: 'റബ്ബർ' },
      { name: 'Coconut', category: 'Plantation', localName: 'നാളികേരം' },
      { name: 'Wetland Paddy', category: 'Paddy', localName: 'നെല്ല്' },
    ],
  });
}
