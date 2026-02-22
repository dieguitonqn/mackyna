export default async function listGrupoMusc() {
    
    const gruposMusc = await fetch("/api/gruposMusc").then((res) => res.json());
    
    return gruposMusc
}