const steps = [
  { id: 1, label: "Step 1" },
  { id: 2, label: "Step 2" },
  { id: 3, label: "Step 3" },
];

const choisesStep1 = {
  OPTION_HIP: "Hip",
  OPTION_KNEE: "Knee",
  // OPTION_SPINE: "Spine",
};

const choicesStep2 = {
  OPTION_FALSE_POSITIVE: "False positive minimization",
  OPTION_BALANCED_PREDICTION: "Balanced prediction",
  OPTION_FALSE_NEGATIVE: "False negative minimization",
};

const choisesStep3Score = {
  OPTION_PHYSICAL: "Physical",
  OPTION_MENTAL: "Mental",
};

const choisesStep3Source = {
  OPTION_BATCH: "Insert batch data",
  OPTION_MANUALLY: "Insert data manually",
};

const formDataManually = {
  Default: [
    {
      type: "radio",
      label: "Gender",
      name: "sesso",
      options: ["Male", "Female"],
    },
    {
      type: "number",
      label: "Age patient",
      name: "anni_ricovero",
      validation: "validateAge",
    },
    {
      type: "select",
      label: "ASA Class",
      name: "classe_asa",
      options: ["select ASA class", "1", "2", "3", "4"],
    },
    {
      type: "number",
      label: "Height Pre operation (cm)",
      name: "bmi_altezza_preOp",
      validation: "validateHeight",
    },
    {
      type: "number",
      label: "Weight Pre operation (kg)",
      name: "bmi_peso_preOp",
      validation: "validateWeight",
    },
    {
      type: "number",
      label: "VAS Total pre operation",
      name: "VAS_Total_PreOp",
      validation: "validateVAS",
    },
    {
      type: "number",
      label: "SF12 PhysicalScore Pre operation",
      name: "physicalScore",
      validation: "validateSF12Physical",
    },
    {
      type: "number",
      label: "SF12 MentalScore Pre operation",
      name: "mentalScore",
      validation: "validateSF12Mental",
    },
    {
      type: "number",
      label: "SF12 - Health self-assessment",
      name: "SF12_autovalsalute_risp_0",
      validation: "validateSelfAssessment",
    },
    {
      type: "number",
      label: "SF12 - Ability to climb stairs",
      name: "SF12_scale_risp_0",
      validation: "validateResponseScale",
    },
    {
      type: "number",
      label: "SF12 - Did the patient accomplished less than they would like due to physical problems?",
      name: "SF12_ultimomeseresa_risp_0",
      validation: "validateYield",
    },
    {
      type: "number",
      label: "SF12 - Did the patient felt limited in their activities?",
      name: "SF12_ultimomeselimite_risp_0",
      validation: "validateLimit",
    },
    {
      type: "number",
      label: "SF12 - Did the patient accomplished less than they would like due to emotional problems?",
      name: "SF12_ultimomeseemo_risp_0",
      validation: "validateEmo",
    },
    {
      type: "number",
      label: "SF12 - How much pain interferred with the patient's normal work?",
      name: "SF12_ultimomeseostacolo_risp_0",
      validation: "validateHurdle",
    },
    {
      type: "number",
      label: "SF12 - How much did the patient felt calm and peaceful?",
      name: "SF12_ultimomesesereno_risp_0",
      validation: "validateClear",
    },
    {
      type: "number",
      label: "SF12 - How much did the patient felt having a lot of energy?",
      name: "SF12_ultimomeseenergia_risp_0",
      validation: "validateEnergy",
    },
    {
      type: "number",
      label: "SF12 - How much did the patient felt downhearted and blue?",
      name: "SF12_ultimomesetriste_risp_0",
      validation: "validateSadness",
    },
    {
      type: "number",
      label: "SF12 - Degree to which the patient's problems interferred with social activities",
      name: "SF12_ultimomesesociale_risp_0",
      validation: "validateSocialization",
    },
  ]
  // ,
  // Spine: [
  //   {
  //     type: "radio",
  //     label: "Gender",
  //     name: "sesso",
  //     options: ["Male", "Female"],
  //   },
  //   {
  //     type: "select",
  //     label: "Name operation",
  //     name: "nome_operazione",
  //     options: ["Select operation","Cervical arthrodesis", "Lumbar arthrodesis", "Kyphoplasty", "Lumbar decompression", "Degenerative deformity", "Idiopathic deformity", "Cervical hernia", "Lumbar hernia", "Vertebral tumor"],
  //   },
  //   {
  //       type: "number",
  //       label: "Age patient",
  //       name: "anni_ricovero",
  //       validation: "validateAge",
  //     },
  //     {
  //       type: "number",
  //       label: "ODI Total PreOp",
  //       name: "ODI_Total_PreOp",
  //       validation: "validateODI",
  //     },
  //     {
  //       type: "number",
  //       label: "Vas Back PreOp",
  //       name: "Vas_Back_PreOp",
  //       validation: "validateVASBack",
  //     },
  //     {
  //       type: "number",
  //       label: "Vas Leg PreOp",
  //       name: "Vas_Leg_PreOp",
  //       validation: "validateVASLeg",
  //     },
  //     {
  //       type: "number",
  //       label: "SF36 General Health PreOp",
  //       name: "SF36_GeneralHealth_PreOp",
  //       validation: "validateSF36",
  //     },      
  //     {
  //       type: "number",
  //       label: "SF36 Physical Functioning PreOp",
  //       name: "SF36_PhysicalFunctioning_PreOp",
  //       validation: "validateSF36",
  //     },      
  //     {
  //       type: "number",
  //       label: "SF36 RoleLimit Physical PreOp",
  //       name: "SF36_RoleLimitPhysical_PreOp",
  //       validation: "validateSF36",
  //     },  
  //     {
  //       type: "number",
  //       label: "SF36 Role Limit Emotional PreOp",
  //       name: "SF36_RoleLimitEmotional_PreOp",
  //       validation: "validateSF36",
  //     },   
  //     {
  //       type: "number",
  //       label: "SF36 Social Functioning PreOp",
  //       name: "SF36_SocialFunctioning_PreOp",
  //       validation: "validateSF36",
  //     },   
  //     {
  //       type: "number",
  //       label: "SF36 Pain PreOp",
  //       name: "SF36_Pain_PreOp",
  //       validation: "validateSF36",
  //     },      
  //     {
  //       type: "number",
  //       label: "SF36 Energy Fatigue PreOp",
  //       name: "SF36_EnergyFatigue_PreOp",
  //       validation: "validateSF36",
  //     },      
  //     {
  //       type: "number",
  //       label: "SF36 Emotional Well Being PreOp",
  //       name: "SF36_EmotionalWellBeing_PreOp",
  //       validation: "validateSF36",
  //     },      
  //     {
  //       type: "number",
  //       label: "SF36 Mental Score PreOp",
  //       name: "SF36_MentalScore_PreOp",
  //       validation: "validateSF36",
  //     },      
  //     {
  //       type: "number",
  //       label: "SF36 Physical score PreOp",
  //       name: "SF36_PhysicalScore_PreOp",
  //       validation: "validateSF36",
  //     },
  //     {
  //       type: "number",
  //       label: "FABQ Work PreOp",
  //       name: "FABQ_Work_PreOp",
  //       validation: "validateFABQ",
  //     },

  //     {
  //       type: "select",
  //       label: "ASA Class",
  //       name: "classe_asa_1",
  //       options: ["select ASA class", "1", "2", "3", "4"],
  //     },      
  //     {
  //       type: "select",
  //       label: "MORBIDITY",
  //       name: "MORBIDITY",
  //       options: ["select Morbidity", "1", "2", "3", "4"]
  //     },

  // ],
};

const operationEnum = {
  "Cervical arthrodesis": 0,
  "Lumbar arthrodesis": 1,
  "Kyphoplasty": 2,
  "Lumbar decompression": 3,
  "Degenerative deformity": 4,
  "Idiopathic deformity": 5,
  "Cervical hernia": 6,
  "Lumbar hernia": 7,
  "Vertebral tumor": 8
};

export {
  choisesStep1,
  choicesStep2,
  choisesStep3Score,
  choisesStep3Source,
  formDataManually,
  steps,
  operationEnum
};
