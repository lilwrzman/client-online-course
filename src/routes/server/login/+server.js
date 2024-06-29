import { json } from "@sveltejs/kit"

export async function POST(event) {
    try {
        const { email, password, role } = await event.request.json()

        const response = await fetch('https://hls-egy.pocari.id/api/login', {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ email, password, role })
        })

        // const text = await response.text()
        // console.log(text)
        const data = await response.json();
        console.log(data)

        if (!response.ok) {
            return json({
                status: response.status,
                body: { error: data.error || 'Autentikasi gagal 1' }
            })
        }

        if(data.status){
            const userData = JSON.parse(data.userData)
            const { token, ...datas } = userData
            return json(
                { datas, status: true },
                {
                    headers: {
                        'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=${1 * 24 * 60 * 60}`
                    }
                }
            )
        }else {
            return json(data)
        }
    } catch(error) {
        // console.log(error)
        return json({
            status: false,
            body: { error: error || 'Autentikasi gagal 2' }
        })
    }
}