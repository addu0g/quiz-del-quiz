module.exports =function(sequelize, DataTypes){
	return sequelize.define('Categoria',
					{ nombre: {
								type:	DataTypes.STRING, 
								validate:{ notEmpty : {msg:"-> Falta categoria"}}
						},
				})
}
