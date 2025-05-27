import {Schema, model, models} from "mongoose"


const GlobalConfigSchema = new Schema(
    {
      valorClase: {type: Number, required: true},
      valorSemana: {type: Number, required: true},
      valorQuincena: {type: Number, required: true},
      valorTresDias: {type: Number, required: true},
      valorCincoDias: {type: Number, required: true},
      valorLibre: {type: Number, required: true},
      
    })

    const GlobalConfig = models.GlobalConfig || model('GlobalConfig', GlobalConfigSchema);

    export default GlobalConfig;