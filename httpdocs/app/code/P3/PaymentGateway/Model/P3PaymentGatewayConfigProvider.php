<?php

namespace P3\PaymentGateway\Model;

use Magento\Checkout\Model\ConfigProviderInterface;
use Magento\Framework\View\Asset\Source;

class P3PaymentGatewayConfigProvider implements ConfigProviderInterface
{
    /**
    * @param CcConfig $ccConfig
    * @param Source $assetSource
    */
    public function __construct(
        \Magento\Payment\Model\CcConfig $ccConfig,
        Source $assetSource
    ) {
        $this->ccConfig = $ccConfig;
        $this->assetSource = $assetSource;
    }

    /**
    * @var string[]
    */
    protected $_methodCode = 'P3_PaymentGateway';

    /**
    * {@inheritdoc}
    */
    public function getConfig()
    {
		
        return [
            'payment' => [
                'paymentconfigdata' => [
                    'months' => [$this->_methodCode => $this->ccConfig->getCcMonths()],
                    'years' => [$this->_methodCode => $this->ccConfig->getCcYears()],
                ]
            ]
        ];
    }
}