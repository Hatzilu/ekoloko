import { NextResponse } from "next/server";



export async function GET(){
    console.log('deez nuts');
    

    return NextResponse.json({message: 'deez nuts'});
}